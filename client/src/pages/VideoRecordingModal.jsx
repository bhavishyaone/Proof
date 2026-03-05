import React, { useState, useEffect, useRef } from "react";
import { X, Video, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function VideoRecordingModal({ onClose, spaceSlug, space }) {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [videoDevices, setVideoDevices] = useState([]);
  const [audioDevices, setAudioDevices] = useState([]);
  const [selectedVideoDeviceId, setSelectedVideoDeviceId] = useState("");
  const [selectedAudioDeviceId, setSelectedAudioDeviceId] = useState("");
  const [fileObject, setFileObject] = useState(null);

  const mediaRecorderRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [recordTime, setRecordTime] = useState(0);
  const [isReviewing, setIsReviewing] = useState(false);
  const timerRef = useRef(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getDevices() {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter(device => device.kind === "videoinput");
        const audioInputs = devices.filter(device => device.kind === "audioinput");
        
        setVideoDevices(videoInputs);
        setAudioDevices(audioInputs);
        
        if (videoInputs.length > 0) setSelectedVideoDeviceId(videoInputs[0].deviceId);
        if (audioInputs.length > 0) setSelectedAudioDeviceId(audioInputs[0].deviceId);
      } catch (err) {
        console.error("Error accessing media devices.", err);
      }
    }
    getDevices();
  }, []);

  useEffect(() => {
    if (fileObject) return;

    async function startStream() {
      if (!selectedVideoDeviceId && !selectedAudioDeviceId) return;
      
      try {
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }

        const newStream = await navigator.mediaDevices.getUserMedia({
          video: selectedVideoDeviceId ? { deviceId: { exact: selectedVideoDeviceId } } : true,
          audio: selectedAudioDeviceId ? { deviceId: { exact: selectedAudioDeviceId } } : true
        });

        setStream(newStream);
        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
        }
      } catch (err) {
        console.error("Error starting stream.", err);
      }
    }
    
    startStream();

  }, [selectedVideoDeviceId, selectedAudioDeviceId, fileObject]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileObject(file);
      const fileUrl = URL.createObjectURL(file);
      
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
        videoRef.current.src = fileUrl;
        videoRef.current.controls = true;
      }
    }
  };

  const handleClose = () => {
    if (stream) stream.getTracks().forEach(track => track.stop());
    onClose();
  };

  const startRecording = () => {
    if (!stream) return;
    setIsRecording(true);
    setRecordedChunks([]);
    setRecordTime(0);

    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        setRecordedChunks(prev => [...prev, event.data]);
      }
    };

    mediaRecorder.start();

    timerRef.current = setInterval(() => {
      setRecordTime(prev => {
        if (prev >= 119) {
          stopRecording(); 
          return 120;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    clearInterval(timerRef.current);
    setIsRecording(false);
    setIsReviewing(true);
  };

  const handleRetake = async () => {
    setRecordedChunks([]);
    setFileObject(null);
    setIsReviewing(false);
    setRecordTime(0);
    

    if (videoRef.current) {
      videoRef.current.controls = false;
      videoRef.current.src = "";
    }
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: selectedVideoDeviceId ? { deviceId: { exact: selectedVideoDeviceId } } : true,
        audio: selectedAudioDeviceId ? { deviceId: { exact: selectedAudioDeviceId } } : true
      });

      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err) {
      console.error("Error restarting stream on retake:", err);
    }
  };

  const handleSubmit = async () => {
    setError("");
    if (!name.trim()) return setError("Your name is required.");
    if (!email.trim()) return setError("Your email is required.");

    const formData = new FormData();
    formData.append("type", "video");
    formData.append("name", name.trim());
    formData.append("email", email.trim());
    formData.append("rating", "5");
    formData.append("message", message.trim() || "Video testimonial submission.");
    formData.append("consent", "true");

    if (recordedChunks.length > 0) {
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      formData.append("video", blob, "testimonial.webm");
    } else if (fileObject) {
      formData.append("video", fileObject, fileObject.name);
    } else {
      return setError("No video to submit.");
    }

    setSubmitting(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/public/${spaceSlug}/submit`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (stream) stream.getTracks().forEach(track => track.stop());
      onClose();
      navigate("/thank-you");
    } catch (err) {
      setError(err.response?.data?.message || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  useEffect(() => {
    if (isReviewing && recordedChunks.length > 0 && videoRef.current) {
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      videoRef.current.srcObject = null;
      videoRef.current.src = url;
      videoRef.current.controls = true;
    }
  }, [isReviewing, recordedChunks]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-sans">
      
      <div className="w-full max-w-[500px] bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-8 relative flex flex-col items-center">
        
        <button 
          onClick={handleClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 bg-[#2A2A2A] rounded-full flex items-center justify-center mb-4">
          <Video className="w-6 h-6 text-white" />
        </div>

        <h2 className="text-xl font-bold text-white mb-2 tracking-tight">
          Check Your Camera & Microphone
        </h2>
        

        <div className="w-full aspect-video bg-[#111111] rounded-xl border border-[#2A2A2A] mb-8 relative flex flex-col items-center justify-center overflow-hidden">
          
          <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-2 z-10">
            <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : (fileObject ? 'bg-blue-500' : 'bg-red-500')}`} />
            <span className="text-white text-[10px] font-bold tracking-widest">
              {isRecording ? `REC ${formatTime(recordTime)}` : (fileObject ? 'FILE' : 'LIVE')}
            </span>
          </div>

          <video 
            ref={videoRef}
            autoPlay 
            playsInline 
            muted={!fileObject && !isReviewing} 
            className={`w-full h-full object-cover ${(!fileObject && !isReviewing) ? 'transform scale-x-[-1]' : ''}`}
          />

          {!stream && !fileObject && (
            <User className="absolute w-16 h-16 text-[#2A2A2A]" />
          )}
        </div>

        <div className={`w-full text-left mb-8 transition-opacity ${isRecording || isReviewing || fileObject ? 'opacity-30 pointer-events-none' : ''}`}>
          <p className="text-[#666666] text-[10px] font-bold tracking-[0.15em] uppercase mb-4">
            Device Settings
          </p>

          <div className="mb-4">
            <label className="block text-[#888888] text-xs mb-1.5 pl-1">Camera</label>
            <div className={`relative w-full bg-[#111111] border border-[#2A2A2A] text-white px-4 py-2.5 rounded-lg flex items-center justify-between transition-opacity ${fileObject ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-[#444]'}`}>
              <span className="text-sm truncate pr-4">
                {videoDevices.find(d => d.deviceId === selectedVideoDeviceId)?.label || "FaceTime HD Camera"}
              </span>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500 flex-shrink-0"><path d="M4.18179 6.18181C4.35753 6.00608 4.64245 6.00608 4.81819 6.18181L7.49999 8.86362L10.1818 6.18181C10.3575 6.00608 10.6424 6.00608 10.8182 6.18181C10.9939 6.35755 10.9939 6.64247 10.8182 6.81821L7.81819 9.81821C7.73379 9.9026 7.61934 9.95001 7.49999 9.95001C7.38064 9.95001 7.26618 9.9026 7.18179 9.81821L4.18179 6.81821C4.00605 6.64247 4.00605 6.35755 4.18179 6.18181Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
              <select 
                disabled={!!fileObject || isRecording || isReviewing}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full disabled:cursor-not-allowed"
                value={selectedVideoDeviceId}
                onChange={(e) => setSelectedVideoDeviceId(e.target.value)}
              >
                {videoDevices.map((device, i) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || `Camera ${i + 1}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-[#888888] text-xs mb-1.5 pl-1">Microphone</label>
            <div className={`relative w-full bg-[#111111] border border-[#2A2A2A] text-white px-4 py-2.5 rounded-lg flex items-center justify-between transition-opacity ${fileObject ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-[#444]'}`}>
              <span className="text-sm truncate pr-4">
                {audioDevices.find(d => d.deviceId === selectedAudioDeviceId)?.label || "Built-in Microphone"}
              </span>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500 flex-shrink-0"><path d="M4.18179 6.18181C4.35753 6.00608 4.64245 6.00608 4.81819 6.18181L7.49999 8.86362L10.1818 6.18181C10.3575 6.00608 10.6424 6.00608 10.8182 6.18181C10.9939 6.35755 10.9939 6.64247 10.8182 6.81821L7.81819 9.81821C7.73379 9.9026 7.61934 9.95001 7.49999 9.95001C7.38064 9.95001 7.26618 9.9026 7.18179 9.81821L4.18179 6.81821C4.00605 6.64247 4.00605 6.35755 4.18179 6.18181Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
              <select 
                disabled={!!fileObject || isRecording || isReviewing}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full disabled:cursor-not-allowed"
                value={selectedAudioDeviceId}
                onChange={(e) => setSelectedAudioDeviceId(e.target.value)}
              >
                {audioDevices.map((device, i) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || `Microphone ${i + 1}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            
            <div className="space-y-3">
              </div>
          </div>
        </div>

        {isReviewing || fileObject ? (
          <div className="w-full flex flex-col gap-3 mb-4">

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Name <span className="text-red-500">*</span></label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="bg-[#111111] border-[#2A2A2A] text-white focus-visible:ring-1 focus-visible:ring-gray-600 rounded-lg h-10 text-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Email <span className="text-red-500">*</span></label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="bg-[#111111] border-[#2A2A2A] text-white focus-visible:ring-1 focus-visible:ring-gray-600 rounded-lg h-10 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Short description (optional)</label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Briefly describe your experience..."
                className="bg-[#111111] border-[#2A2A2A] text-white focus-visible:ring-1 focus-visible:ring-gray-600 rounded-lg resize-none text-sm min-h-[70px]"
              />
            </div>

            {error && <p className="text-red-500 text-xs font-medium text-center">{error}</p>}

            <div className="flex gap-3">
              <Button
                onClick={handleRetake}
                variant="outline"
                className="flex-1 bg-transparent hover:bg-[#2A2A2A] text-white border-[#333] font-bold py-6 rounded-lg text-base"
              >
                Retake
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 bg-white hover:bg-gray-100 text-black font-bold py-6 rounded-lg text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Uploading..." : "Submit Video"}
              </Button>
            </div>
          </div>
        ) : (
          <Button 
            onClick={isRecording ? stopRecording : startRecording}
            className={`w-full font-bold py-6 rounded-lg text-base mb-4 transition-colors ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-white hover:bg-gray-100 text-black'
            }`}
          >
            {isRecording ? "Stop Recording" : "Record My Video"}
          </Button>
        )}

        {!isRecording && !isReviewing && !fileObject && (
          <label className="text-[#888888] text-xs hover:text-white transition-colors font-medium cursor-pointer">
            Choose a File to Submit
            <input 
              type="file" 
              accept="video/*" 
              className="hidden" 
              onChange={handleFileUpload} 
            />
          </label>
        )}

      </div>
    </div>
  );
}
