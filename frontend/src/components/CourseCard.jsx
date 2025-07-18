import { useRef } from "react";
import { useInView } from "react-intersection-observer";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function CourseCard({ course }) {
  const videoRef = useRef(null);
  const { ref, inView } = useInView({ triggerOnce: true });

  

  return (
    <div ref={ref} className="bg-white shadow p-4 rounded hover:shadow-lg">
      {course.video && inView && (
        <div>
          <video
            ref={videoRef}
            src={course.video}
            controls
            className="w-full mt-3 rounded"
            // poster="/video-placeholder.png"
            preload="none"
          />
          
        </div>
      )}

      <h3 className="text-lg font-semibold mt-2">{course.title}</h3>
      <p className="text-sm text-gray-500">{dayjs(course.created_at).fromNow()}</p>

      {course.meet_link && (
        <a href={course.meet_link} target="_blank" rel="noopener noreferrer" className="block mt-3 text-blue-600 underline">
          Join Lecture
        </a>
      )}
      {course.recorded_link && (
        <a href={course.recorded_link} target="_blank" rel="noopener noreferrer" className="block mt-3 text-purple-600 underline">
          Watch Recorded Lecture
        </a>
      )}
      {(course.material?.endsWith(".ppt") || course.material?.endsWith(".pptx")) && (
        <a href={course.material} target="_blank" rel="noopener noreferrer" className="block mt-3 text-green-600 underline">
          View Presentation
        </a>
      )}
    </div>
  );
}
