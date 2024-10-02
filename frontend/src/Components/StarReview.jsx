import { FaStar, FaRegStarHalfStroke } from "react-icons/fa6";

export default function StarReview({ rating }) {
    const starArray = new Array(5).fill(0);


    const stars = (rating) => {
        switch (true) {
            case rating === 5:
                return (
                    <div className="flex">
                        <FaStar className="text-yellow-300" />
                        <FaStar className="text-yellow-300" />
                        <FaStar className="text-yellow-300" />
                        <FaStar className="text-yellow-300" />
                        <FaStar className="text-yellow-300" />
                    </div>
                );
            case rating > 4 && rating < 5:
                return (
                    <div className="flex">
                        <FaStar className="text-yellow-300" />
                        <FaStar className="text-yellow-300" />
                        <FaStar className="text-yellow-300" />
                        <FaStar className="text-yellow-300" />
                        <FaRegStarHalfStroke className="text-yellow-300" />
                    </div>
                );
            case rating === 4:
                return (
                    <div className="flex">
                        <FaStar className="text-yellow-300" />
                        <FaStar className="text-yellow-300" />
                        <FaStar className="text-yellow-300" />
                        <FaStar className="text-yellow-300" />
                        <FaStar />
                    </div>
                );
            case rating > 3 && rating < 4:
                return (
                    <div className="flex">
                        <FaStar className="text-yellow-300" />
                        <FaStar className="text-yellow-300" />
                        <FaStar className="text-yellow-300" />
                        <FaRegStarHalfStroke className="text-yellow-300" />
                        <FaStar />
                    </div>
                );
            case rating === 3:
                return (
                    <div className="flex">
                        <FaStar className="text-yellow-300" />
                        <FaStar className="text-yellow-300" />
                        <FaStar className="text-yellow-300" />
                        <FaStar />
                        <FaStar />
                    </div>
                );
            case rating > 2 && rating < 3:
                return (
                    <div className="flex">
                        <FaStar className="text-yellow-300" />
                        <FaStar className="text-yellow-300" />
                        <FaRegStarHalfStroke className="text-yellow-300" />
                        <FaStar />
                        <FaStar />
                    </div>
                );
            case rating === 2:
                return (
                    <div className="flex">
                        <FaStar className="text-yellow-300" />
                        <FaStar className="text-yellow-300" />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                    </div>
                );
            case rating > 1 && rating < 2:
                return (
                    <div className="flex">
                        <FaStar className="text-yellow-300" />
                        <FaRegStarHalfStroke className="text-yellow-300" />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                    </div>
                );
            case rating === 1:
                return (
                    <div className="flex">
                        <FaStar className="text-yellow-300" />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                    </div>
                );
            case rating > 0 && rating < 1:
                return (
                    <div className="flex">
                        <FaRegStarHalfStroke className="text-yellow-300" />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                    </div>
                );
        }
    };



    return (
        <div className="flex justify-center mt-5">
            {stars(rating)}
        </div>
    );
}
