import React, { useState, useRef, useEffect } from 'react';
import { ReactMediaRecorder } from 'react-media-recorder';
import { FaPlay, FaStop, FaPause, FaRedo, FaCheck, FaTimes } from 'react-icons/fa';

// Componente para mostrar preview de la cámara
const VideoPreview = ({ previewStream, status }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current && previewStream) {
            videoRef.current.srcObject = previewStream;
        }
    }, [previewStream]);

    if ((status === 'recording' || status === 'paused') && previewStream) {
        return (
            <video
                ref={videoRef}
                autoPlay
                muted
                className="w-80 h-80 border-2 border-stone-300 shadow-[0_4px_20px_rgba(0,0,0,0.15)] rounded-lg object-cover"
            />
        );
    }

    return null;
};

const VideoRecorder = ({ onVideoRecorded, onCancel }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordedVideo, setRecordedVideo] = useState(null);
    const currentStreamRef = useRef(null);

    const handleStop = (blobUrl, blob) => {
        setRecordedVideo({ blobUrl, blob });
        setIsRecording(false);

        // Detener todos los tracks del stream para cerrar la cámara
        if (currentStreamRef.current) {
            currentStreamRef.current.getTracks().forEach(track => {
                track.stop();
            });
            currentStreamRef.current = null;
        }
    };

    const handleSave = () => {
        if (recordedVideo) {
            // Crear un archivo File desde el blob
            const file = new File([recordedVideo.blob], `video-${Date.now()}.webm`, {
                type: recordedVideo.blob.type
            });
            onVideoRecorded(file);
        }
    };

    const handleRetry = (clearBlobUrl) => {
        setRecordedVideo(null);
        setIsRecording(false);

        // Limpiar el blob URL si existe
        if (clearBlobUrl) {
            clearBlobUrl();
        }
    };

    const handleCancel = (stopRecording, clearBlobUrl) => {
        // Si hay una grabación activa, detenerla primero
        if (isRecording) {
            stopRecording();
        }

        // Limpiar el blob URL si existe
        if (clearBlobUrl) {
            clearBlobUrl();
        }

        // Detener todos los tracks del stream para cerrar la cámara
        if (currentStreamRef.current) {
            currentStreamRef.current.getTracks().forEach(track => {
                track.stop();
            });
            currentStreamRef.current = null;
        }

        // Llamar al callback de cancelar del componente padre
        onCancel();
    };

    return (
        <div className="space-y-3 bg-gradient-to-br from-stone-50 to-purple-50 pt-2 px-4 pb-2 flex flex-col items-center">
            <ReactMediaRecorder
                video
                onStop={handleStop}
                render={({ status, startRecording, stopRecording, pauseRecording, resumeRecording, mediaBlobUrl, clearBlobUrl, previewStream }) => {
                    // Almacenar la referencia del stream cuando esté disponible
                    if (previewStream && !currentStreamRef.current) {
                        currentStreamRef.current = previewStream;
                    }

                    return (
                        <div>
                            {/* Estado de grabación */}
                            <div className="text-center mb-3">
                                <div className="inline-flex items-center px-6 py-3 rounded-full bg-white shadow-md border border-stone-200">
                                    <div className={`w-3 h-3 rounded-full mr-3 ${
                                        status === 'recording' ? 'bg-red-500 animate-pulse' : 
                                        status === 'stopped' ? 'bg-green-500' : 
                                        status === 'idle' ? 'bg-stone-400' : 
                                        status === 'paused' ? 'bg-yellow-500' : ''
                                    }`}></div>
                                    <span className="font-semibold text-stone-700 text-base">
                                        {status === 'recording' && 'Grabando...'}
                                        {status === 'stopped' && 'Grabación Completada'}
                                        {status === 'idle' && 'Listo para Grabar'}
                                        {status === 'paused' && 'En Pausa'}
                                    </span>
                                </div>
                            </div>

                            {/* Layout principal: video izquierda, controles derecha */}
                            <div className="flex gap-8 items-center justify-center">
                                {/* Vista previa de la cámara o video grabado */}
                                <div>
                                    {recordedVideo ? (
                                        <video
                                            src={recordedVideo.blobUrl}
                                            controls
                                            preload="auto"
                                            muted
                                            onLoadedMetadata={(e) => {
                                                const video = e.target;
                                                // Reproducir un frame para forzar la carga de metadatos
                                                video.play().then(() => {
                                                    video.pause();
                                                    video.currentTime = 0;
                                                    video.muted = false; // Habilitar audio después de cargar metadatos
                                                }).catch(() => {
                                                    // Si falla el autoplay, intentar de otra manera
                                                    video.currentTime = 0.1;
                                                    setTimeout(() => {
                                                        video.currentTime = 0;
                                                        video.muted = false;
                                                    }, 100);
                                                });
                                            }}
                                            className="w-80 h-80 border-2 border-stone-300 shadow-[0_4px_20px_rgba(0,0,0,0.15)] bg-stone-50 rounded-lg object-cover"
                                        />
                                    ) : (
                                        <>
                                            <VideoPreview previewStream={previewStream} status={status} />
                                            {!(status === 'recording' || status === 'paused') && (
                                                <div className="w-80 h-80 bg-gradient-to-br from-stone-100 to-stone-200 border-2 border-dashed border-stone-400 flex items-center justify-center shadow-[inset_0_4px_20px_rgba(0,0,0,0.1)] rounded-lg">
                                                    <div className="text-center">
                                                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                        <p className="text-stone-600 font-medium text-lg">
                                                            Vista previa del video aparecerá aquí
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>

                                {/* Controles de grabación */}
                                <div className="flex flex-col gap-3 items-center justify-center">
                                    {!recordedVideo ? (
                                        <>
                                            {/* Estado idle: Iniciar grabación + Cancelar */}
                                            {status === 'idle' && (
                                                <>
                                                    <button
                                                        onClick={() => {
                                                            startRecording();
                                                            setIsRecording(true);
                                                        }}
                                                        title="Iniciar grabación"
                                                        className="group flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                                                    >
                                                        <FaPlay className="ml-1 text-lg group-hover:scale-110 transition-transform" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleCancel(stopRecording, clearBlobUrl)}
                                                        title="Cancelar"
                                                        className="group flex items-center justify-center w-16 h-16 bg-gradient-to-br from-stone-400 to-stone-500 text-white rounded-2xl hover:from-stone-500 hover:to-stone-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                                                    >
                                                        <FaTimes className="text-lg group-hover:scale-110 transition-transform" />
                                                    </button>
                                                </>
                                            )}

                                            {/* Estado recording: Pausar + Detener */}
                                            {status === 'recording' && (
                                                <>
                                                    <button
                                                        onClick={pauseRecording}
                                                        title="Pausar"
                                                        className="group flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-2xl hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                                                    >
                                                        <FaPause className="text-lg group-hover:scale-110 transition-transform" />
                                                    </button>
                                                    <button
                                                        onClick={stopRecording}
                                                        title="Detener"
                                                        className="group flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-2xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                                                    >
                                                        <FaStop className="text-lg group-hover:scale-110 transition-transform" />
                                                    </button>
                                                </>
                                            )}

                                            {/* Estado paused: Reanudar + Detener */}
                                            {status === 'paused' && (
                                                <>
                                                    <button
                                                        onClick={resumeRecording}
                                                        title="Reanudar"
                                                        className="group flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                                                    >
                                                        <FaPlay className="ml-1 text-lg group-hover:scale-110 transition-transform" />
                                                    </button>
                                                    <button
                                                        onClick={stopRecording}
                                                        title="Detener"
                                                        className="group flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-2xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                                                    >
                                                        <FaStop className="text-lg group-hover:scale-110 transition-transform" />
                                                    </button>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        /* Estado después de grabar: Grabar de nuevo + Usar este video */
                                        <>
                                            <button
                                                onClick={() => handleRetry(clearBlobUrl)}
                                                title="Grabar de nuevo"
                                                className="group flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                                            >
                                                <FaRedo className="text-lg group-hover:scale-110 transition-transform" />
                                            </button>
                                            <button
                                                onClick={handleSave}
                                                title="Usar este video"
                                                className="group flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                                            >
                                                <FaCheck className="text-lg group-hover:scale-110 transition-transform" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                }
                }
            />
        </div>
    );
};

export default VideoRecorder;