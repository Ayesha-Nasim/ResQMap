import { Redirect } from "expo-router";
import "../polyfills";

export default function Index() {
  return <Redirect href="/landing-page" />;
}
