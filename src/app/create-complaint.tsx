import { Redirect } from "expo-router";

export default function CreateComplaint() {
  return <Redirect href={{ pathname: "/request", params: { type: "complaint" } }} />;
}
