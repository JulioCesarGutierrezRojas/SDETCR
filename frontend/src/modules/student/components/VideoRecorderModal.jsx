import React from 'react';
import { FaTimes } from 'react-icons/fa';
import VideoRecorder from './VideoRecorder.jsx';

const VideoRecorderModal = ({ isOpen, onClose, onVideoRecorded }) => {
    if (!isOpen) return null;

    const handleVideoRecorded = (file) => {
        onVideoRecorded(file);
        onClose();
    };

    const handleCancel = () => {
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-opacity-10 backdrop-blur-md flex items-center justify-center z-50">
            <div className="bg-gradient-to-br from-stone-50 to-stone-100 shadow-[0_0_50px_rgba(0,0,0,0.25)] max-w-xl w-full mx-4 max-h-[95vh] overflow-y-auto border-4 border-stone-300 rounded-lg">
                {/* Header del modal */}
                <div className="flex justify-between items-center px-8 py-6 border-b-4 border-stone-300 bg-gradient-to-r from-purple-600 to-purple-700 rounded-t-lg">
                    <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <h3 className="text-xl font-bold text-white tracking-wide">
                            Grabación de Video
                        </h3>
                    </div>
                    <button
                        onClick={handleCancel}
                        className="text-purple-200 hover:text-white transition-colors p-2 hover:bg-purple-800 rounded-lg"
                    >
                        <FaTimes size={18} />
                    </button>
                </div>

                {/* Contenido del modal */}
                <div className="pt-0 px-8 pb-4">
                    <VideoRecorder
                        onVideoRecorded={handleVideoRecorded}
                        onCancel={handleCancel}
                    />
                </div>
            </div>
        </div>
    );
};

export default VideoRecorderModal;
