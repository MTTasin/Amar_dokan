import { FaStar, FaRegStarHalfStroke, FaRegStar } from "react-icons/fa6";

export default function StarReview({ rating }) {
  const safeRating = Math.max(0, Math.min(5, Number(rating) || 0)); // Ensure rating is a number between 0 and 5

  const fullStars = Math.floor(safeRating);
  const hasHalfStar = safeRating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={`full-${i}`} className="text-yellow-400 text-xl" />
      ))}
      {hasHalfStar && (
        <FaRegStarHalfStroke className="text-yellow-400 text-xl" />
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <FaRegStar key={`empty-${i}`} className="text-gray-300 text-xl" />
      ))}
    </div>
  );
}
