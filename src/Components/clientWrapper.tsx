"use client";

import { imagePath } from "@/util/constant/imagePath";
import Image from "next/image";
import Text from "./common/text";
import { IoMdCheckmark } from "react-icons/io";
import { useSelector } from "react-redux";
import { rootState } from "@/store/store";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const authToken = useSelector((state: rootState) => state.user.token);

  return authToken !== "" ? (
    <div>{children}</div>
  ) : (
    <div className="grid grid-cols-1 px-4 items-center justify-center lg:grid-cols-2 h-screen">
      <div className="  h-screen bg-[#15161A] hidden lg:block !text-white">
        <div className="justify-center gap-12 flex flex-col items-center w-[381px] m-auto h-screen">
          <Image
            src={imagePath.authBanner}
            alt="auth banner"
            width={307}
            height={214}
          />
          <Text
            Element="h2"
            text="One app for any financial journey"
            style="lg:!text-2xl"
          />
          <div className="flex flex-col gap-4 xl:gap-8 ">
            <div className="flex items-start gap-3 xl:gap-4 ">
              <div>
                <IoMdCheckmark size={24} height={24} color="#4CAF50" />
              </div>
              <div>
                <Text
                  Element="h4"
                  text="All-in-one tool"
                  isDes={false}
                  style="mb-1 !text-base"
                />
                <Text
                  text="View and organize your finances all in one place
and build your future with smarter wealth management"
                  style="opacity-70 !text-sm"
                />
              </div>
            </div>
            <div className="flex items-start gap-3 xl:gap-4 ">
              <div>
                <IoMdCheckmark size={24} height={24} color="#4CAF50" />
              </div>
              <div>
                <Text
                  Element="h4"
                  text="Secure and bank-grade encryption"
                  isDes={false}
                  style="mb-1 !text-base"
                />
                <Text
                  text="Your financial data is tokenized and masked with the latest Finch security. with end-to-end encryption and data privacy vaults"
                  style="opacity-70 !text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center h-screen items-center">
        {children}
      </div>
    </div>
  );
}
