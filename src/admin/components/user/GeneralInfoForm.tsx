import UploadImage from "@/admin/common/components/ui/UploadImage";
import { USER_FORM_INPUTS } from "@/admin/common/constants/fromData";
import type { IUserData } from "@/interfaces";
import { Field, Input } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

const GeneralInfoForm = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<IUserData>();
  return (
    <>
      <UploadImage fieldName="avatar" fallbackImage="fullName" />
      {USER_FORM_INPUTS.map(({ name, label, placeholder, validation }) => {
        const fieldName = name as keyof IUserData;
        const fieldError = errors[fieldName];

        return (
          <Field.Root invalid={!!fieldError} key={label} maxW={"280px"}>
            <Field.Label fontWeight={"medium"}>{label}</Field.Label>
            <Input
              placeholder={placeholder}
              {...register(fieldName, {
                ...validation,
              })}
              borderColor={`${fieldError ? "red" : "input-border"}`}
            />
            <Field.ErrorText>
              {fieldError && "message" in fieldError
                ? fieldError.message
                : undefined}
            </Field.ErrorText>
          </Field.Root>
        );
      })}
    </>
  );
};

export default GeneralInfoForm;
