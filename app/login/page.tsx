// import BackButton from "@/components/Button/back-button";
import NextButton from "../../components/Button/getStarted-button";
import LoginFields from "../../components/InputField/login-fields";

export default function Home() {
  return (
    <div className="flex flex-col mt-0 ">
      {/* <BackButton /> */}

      <p className="font-bold text-2xl">Let's Sign you in.</p>
      <p className="text-gray text-xl mt-2 font-medium">Welcome back !</p>

      <div>
        <LoginFields />
      </div>

      <NextButton urlLink="/WalletCheck" buttonText="Login" />
    </div>
  );
}
