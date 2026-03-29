import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Stack,
  Link,
  Field,
  Checkbox,
  InputGroup,
  IconButton,
} from "@chakra-ui/react";
import { useColorModeValue } from "../components/ui/color-mode";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

type LoginFormValues = {
  email: string;
  password: string;
  remember: boolean;
};

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit: SubmitHandler<LoginFormValues> = (data) => {
    console.log(data);
  };

  const bg = useColorModeValue("gray.50", "gray.800");
  const cardBg = useColorModeValue("white", "gray.800");
  const border = useColorModeValue("gray.500", "gray.500");

  return (
    <Flex h="full" align="center" justify="center" bg={bg}>
      <Box bg={cardBg} p={8} rounded="lg" shadow="lg" w="full" maxW="400px">
        <Heading mb={6} textAlign="center" size="lg">
          Sign in to your account
        </Heading>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap={4}>
            {/* EMAIL */}
            <Field.Root invalid={!!errors.email}>
              <Field.Label>Email address</Field.Label>
              <Input
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email",
                  },
                })}
              />
              <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
            </Field.Root>

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
								// border={"1px solid"}
								borderColor={border}
              >
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
              </InputGroup>
              <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
            </Field.Root>

            {/* CHECKBOX */}
            <Flex justify="space-between" align="center">
              <Checkbox.Root
                checked={watch("remember")}
                onCheckedChange={(e) => setValue("remember", !!e.checked)}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label>Remember me</Checkbox.Label>
              </Checkbox.Root>

              <Link fontSize="sm" color="blue.400">
                Forgot password?
              </Link>
            </Flex>

            {/* BUTTON */}
            <Button type="submit" colorScheme="blue" loading={isSubmitting}>
              Sign in
            </Button>
          </Stack>
        </form>
      </Box>
    </Flex>
  );
}
