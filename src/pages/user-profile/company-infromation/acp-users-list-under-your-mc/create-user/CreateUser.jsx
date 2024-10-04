import { useState } from "react";
import { icons } from "assets/icons/icons";
import VerificationOfUser from "./verification-of-user/VerificationOfUser";
import SuccessfullySent from "./successfully-sent/SuccessfullySent";
import CreateUserForm from "./create-user-form/CreateUserForm";

function CreateUser({ onClose }) {
  const [step, setStep] = useState("");

  const renderSteps = (step) => {
    switch (step) {
      case "successfully":
        return <SuccessfullySent onClick={onClose} />;

      case "verification":
        return <VerificationOfUser onClose={onClose} />;

      default:
        return <CreateUserForm onAdd={() => setStep("successfully")} />;
    }
  };

  return (
    <div className="bg-white px-4 py-6 rounded-xl relative dark:bg-green_7 dark:text-white lg:w-[96%] lg:max-h-[98%] overflow-y-auto lg:p-4">
      <button onClick={onClose} className="w-max h-max absolute top-4 right-4">
        <icons.close className="w-3 stroke-black dark:stroke-white" />
      </button>

      {renderSteps(step)}
    </div>
  );
}

export default CreateUser;
