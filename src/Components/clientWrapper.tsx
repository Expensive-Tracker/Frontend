"use client";

import { imagePath } from "@/util/constant/imagePath";
import Image from "next/image";
import { useEffect, useState } from "react";
import Text from "./common/text";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  return token ? (
    <div>{children}</div>
  ) : (
    <div className="grid grid-cols-1 px-4 items-center justify-center lg:grid-cols-2 h-screen">
      <div className="flex justify-center gap-12 flex-col items-center">
        <Image
          src={imagePath.authBanner}
          alt="auth banner"
          width={307}
          height={214}
        />
        <Text Element="h2" text="One app for any financial journey" />
        <div></div>
      </div>
      <div className="flex justify-center">{children}</div>
    </div>
  );
}
