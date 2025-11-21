'use client'
import { useEffect, useState } from "react";

export default function ImageWithToken({ url, token = '1|XhXYyGossrCNGHdB60vuLWPYwSbSO1RRcYHVFaAXd5a178cb' }: { url: string; token?: string }) {
  const [imgUrl, setImgUrl] = useState("");

  useEffect(() => {
    async function loadImage() {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const blob = await res.blob();
      setImgUrl(URL.createObjectURL(blob)); // create blob url for <img>
    }

    loadImage();
  }, [url, token]);

  return <img src={imgUrl} alt="" />;
}
