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
import { userLogin } from "../app/feactures/loginSlice";
import { useAppDispatch } from "../hooks/index";

type LoginFormValues = {
  identifier: string;
  password: string;
  remember: boolean;
};

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: {
      identifier: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (data, e) => {
    e?.preventDefault();
    const res = await dispatch(userLogin(data));
    if (userLogin.fulfilled.match(res)) {
      const { user, jwt } = res.payload;
      console.log(user, jwt);
    }
  };

  const bg = useColorModeValue("gray.50", "gray.800");
  const cardBg = useColorModeValue("white", "gray.800");
  const border = useColorModeValue("gray.200", "gray.500");

  return (
    <Flex h="full" align="center" justify="center" bg={bg}>
      <Box bg={cardBg} p={8} rounded="lg" shadow="lg" w="full" maxW="400px">
        <Heading mb={6} textAlign="center" size="lg">
          Sign in to your account
        </Heading>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap={4}>
            {/* EMAIL */}
            <Field.Root invalid={!!errors.identifier}>
              <Field.Label>Email address</Field.Label>
              <Input
                placeholder="Enter your email"
                {...register("identifier", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                    message: "Invalid email",
                  },
                })}
                borderColor={`${errors.identifier ? "red" : border}`}
              />
              <Field.ErrorText>{errors.identifier?.message}</Field.ErrorText>
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
                  borderColor={`${errors.identifier ? "red" : border}`}
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
