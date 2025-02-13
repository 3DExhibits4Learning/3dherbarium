"use client"

import { useIsClient } from "@/functions/client/utils/isClient";

type dividerProps = {
  title: string;
}

export default function ComponentDivider(props: dividerProps) {
  const isClient: boolean = useIsClient();

  var screenSize: boolean = isClient ? window.matchMedia(("(max-width: 768px)")).matches : false;
  var txtSize: string = screenSize ? "1rem" : "1.5rem";

  return (
    <div style={{ fontSize: txtSize, borderTop: '0.5px solid #3d3d3d', borderBottom: '0.5px solid #3d3d3d' }} className="h-16 bg-[#004C46] dark:bg-[#212121] text-white flex justify-center items-center text-center ">
      <p>{props.title}</p>
    </div>
  )

}
