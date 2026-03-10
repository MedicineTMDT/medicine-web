import type { Metadata } from "next";
import { MyRequestsPage } from "./my-requests-page";

export const metadata: Metadata = {
  title: "Yêu cầu của tôi",
  description: "Xem và theo dõi các yêu cầu chỉnh sửa dữ liệu thuốc của bạn.",
};

export default function RequestsPage() {
  return <MyRequestsPage />;
}
