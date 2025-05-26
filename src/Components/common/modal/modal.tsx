"use client";
import { modalProps } from "@/util/interface/props";
import Text from "../text/text";
import { HiOutlineXMark } from "react-icons/hi2";
import { useDispatch } from "react-redux";
import { handleOpenAndCloseModal } from "@/store/slice/uiSlice";

const Modal = ({ id = "add" }: Partial<modalProps>) => {
  const dispatch = useDispatch();
  let modalContent;

  function handleModalClose() {
    dispatch(handleOpenAndCloseModal());
  }

  switch (id) {
    case "add":
      modalContent = (
        <div>
          <Text
            Element="h2"
            text="Add Transaction"
            style="!text-xl lg:!text-2xl "
          />
        </div>
      );
      break;
    case "edit":
      modalContent = (
        <div>
          <Text
            Element="h2"
            text="Add Transaction"
            style="!text-xl lg:!text-2xl "
          />
        </div>
      );
      break;
    case "delete":
      modalContent = (
        <div>
          <Text
            Element="h2"
            text="Add Transaction"
            style="!text-xl lg:!text-2xl "
          />
        </div>
      );
      break;
  }
  return (
    <>
      <style>
        {`
          .modal__backdrop {
    background: rgba(255, 255 , 255, 0.55);
    bottom: 0;
    left: 0;
    overflow: hidden;
    position: fixed;
    right: 0;
    top: 0;
    z-index: 1000;
          `}
      </style>
      <div className="modal__backdrop flex flex-col px-3 justify-center items-center">
        <div className="bg-white text-black px-4 py-6 rounded-md shadow-xl md:max-w-[500px] md:h-auto h-screen my-5 w-full relative">
          {modalContent}
          <div
            className="p-2 bg-gray-100 w-fit rounded-full absolute right-[18px] top-[22px]"
            onClick={handleModalClose}
          >
            <HiOutlineXMark size={20} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
