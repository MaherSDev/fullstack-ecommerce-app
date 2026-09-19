import UploadImage from "@/admin/common/components/ui/UploadImage";
import { USER_FORM_INPUTS } from "@/admin/common/constants/fromData";
import type { IUserData } from "@/interfaces";
import {
  Field,
  HStack,
  IconButton,
  Input,
  InputGroup,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { get, useFormContext, type Path } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";

const FormCreateUser = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<IUserData>();

  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <HStack gap={6}>
      <VStack flex={"1 40%"}>
        <UploadImage fieldName="avatar" fallbackImage="fullName" />
      </VStack>
      <VStack flex={"1 60%"} gap={3}>
        {USER_FORM_INPUTS.map(({ name, label, placeholder, validation }) => {
          const fieldName = name as Path<IUserData>;
          const fieldError = get(errors, fieldName);
          return (
            <Field.Root invalid={!!fieldError} key={label}>
              <Field.Label fontWeight={"medium"}>{label}</Field.Label>
              <Input
                placeholder={placeholder}
                {...register(fieldName, {
                  ...validation,
                })}
                borderColor={`${fieldError ? "red" : "input-border"}`}
              />
              <Field.ErrorText>{fieldError?.message}</Field.ErrorText>
            </Field.Root>
          );
        })}
        {/* PASSWORD */}
        <Field.Root invalid={!!errors.password}>
          <Field.Label>Password</Field.Label>
          <InputGroup
            endElement={
              <IconButton
                aria-label="toggle password"
                variant="ghost"
                size="sm"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </IconButton>
            }
          >
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              borderColor={`${errors.password ? "red" : "input-border"}`}
            />
          </InputGroup>
          <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
        </Field.Root>
      </VStack>
    </HStack>
  );
};

export default FormCreateUser;
