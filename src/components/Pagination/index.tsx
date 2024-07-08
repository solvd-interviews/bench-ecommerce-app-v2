import { useState, useEffect } from "react";

interface PaginationProps {
  pages: number;
  setCurrentPage: (page: number) => void;
}

function Pagination({ pages, setCurrentPage }: PaginationProps) {
  //Set number of pages
  const numberOfPages: any[] = [];
  for (let i = 1; i <= pages; i++) {
    numberOfPages.push(i);
  }

  // Current active button number
  const [currentButton, setCurrentButton] = useState(1);

  // Array of buttons what we see on the page
  const [arrOfCurrButtons, setArrOfCurrButtons] = useState<any[]>([]);

  useEffect(() => {
    let tempNumberOfPages: any[] = [...arrOfCurrButtons];

    let dotsInitial = "...";
    let dotsLeft = "... ";
    let dotsRight = " ...";

    if (numberOfPages.length < 6) {
      tempNumberOfPages = numberOfPages;
    } else if (currentButton >= 1 && currentButton <= 3) {
      tempNumberOfPages = [1, 2, 3, 4, dotsInitial, numberOfPages.length];
    } else if (currentButton === 4) {
      const sliced = numberOfPages.slice(0, 5);
      tempNumberOfPages = [...sliced, dotsInitial, numberOfPages.length];
    } else if (currentButton > 4 && currentButton < numberOfPages.length - 2) {
      // from 5 to 8 -> (10 - 2)
      const sliced1 = numberOfPages.slice(currentButton - 2, currentButton); // sliced1 (5-2, 5) -> [4,5]
      const sliced2 = numberOfPages.slice(currentButton, currentButton + 1); // sliced1 (5, 5+1) -> [6]
      tempNumberOfPages = [
        1,
        dotsLeft,
        ...sliced1,
        ...sliced2,
        dotsRight,
        numberOfPages.length,
      ]; // [1, '...', 4, 5, 6, '...', 10]
    } else if (currentButton > numberOfPages.length - 3) {
      // > 7
      const sliced = numberOfPages.slice(numberOfPages.length - 4); // slice(10-4)
      tempNumberOfPages = [1, dotsLeft, ...sliced];
    } else if (String(currentButton) === dotsInitial) {
      // [1, 2, 3, 4, "...", 10].length = 6 - 3  = 3
      // arrOfCurrButtons[3] = 4 + 1 = 5
      // or
      // [1, 2, 3, 4, 5, "...", 10].length = 7 - 3 = 4
      // [1, 2, 3, 4, 5, "...", 10][4] = 5 + 1 = 6
      setCurrentButton(arrOfCurrButtons[arrOfCurrButtons.length - 3] + 1);
    } else if (String(currentButton) === dotsRight) {
      setCurrentButton(arrOfCurrButtons[3] + 2);
    } else if (String(currentButton) === dotsLeft) {
      setCurrentButton(arrOfCurrButtons[3] - 2);
    }

    setArrOfCurrButtons(tempNumberOfPages);
    setCurrentPage(currentButton);
  }, [currentButton]);

  return (
    <div className=" flex justify-center items-center w-full py-2">
      <button
        className={` mr-4 btn btn-primary shadow-xl  ${
          currentButton === 1 ? "btn-disabled" : ""
        }`}
        disabled={currentButton === 1 ? true : false}
        onClick={() =>
          setCurrentButton((prev) => (prev <= 1 ? prev : prev - 1))
        }
      >
        Prev
      </button>

      {arrOfCurrButtons.map((item, index) => {
        return (
          <button
            key={index}
            className={`w-10 flex justify-center items-center rounded-md font-bold btn btn-primary mx-1 shadow-xl  ${
              currentButton === item ? "" : "bg-opacity-40"
            }`}
            onClick={() => setCurrentButton(item)}
          >
            {item}
          </button>
        );
      })}

      <button
        className={`ml-4 btn btn-primary shadow-xl ${
          currentButton === numberOfPages.length ? "btn-disabled" : ""
        }`}
        disabled={currentButton === numberOfPages.length ? true : false}
        onClick={() =>
          setCurrentButton((prev) =>
            prev >= numberOfPages.length ? prev : prev + 1
          )
        }
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
