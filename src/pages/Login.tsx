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
  Text,
} from "@chakra-ui/react";
import { useColorModeValue } from "../components/ui/color-mode";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { userLogin } from "../app/features/loginSlice";
import { useAppDispatch } from "../hooks/index";
import { useLocation, useNavigate } from "react-router-dom";
import type { LoginFormFields } from "@/interfaces";
import { BsArrowLeft } from "react-icons/bs";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const goBack = () => navigate("/");
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormFields>({
    defaultValues: {
      identifier: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit: SubmitHandler<LoginFormFields> = async (data, e) => {
    e?.preventDefault();
    const res = await dispatch(userLogin(data));
    if (userLogin.fulfilled.match(res)) {
      const data = res.payload;
      const from = location.state?.from || "/";
      navigate(from, { replace: true });
    }
  };

  const bg = useColorModeValue("gray.50", "gray.800");
  const cardBg = useColorModeValue("white", "gray.800");
  const border = useColorModeValue("gray.200", "gray.500");

  return (
    <Flex h="full" align="center" justify="center" bg={bg}>
      <Box bg={cardBg} p={8} rounded="lg" shadow="lg" w="full" maxW="400px">
        <Box as={"div"} bg={cardBg} mb={6}>
          <Flex
            alignItems={"center"}
            maxW={"sm"}
            my={5}
            fontSize={"lg"}
            color="blue.400"
            cursor={"pointer"}
            onClick={goBack}
          >
            <BsArrowLeft />
            <Text ml={2}>Back to Home</Text>
          </Flex>
          <Heading textAlign="center" size="lg" mx={"auto"}>
            Sign in to your account
          </Heading>
        </Box>

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
                  borderColor={`${errors.password ? "red" : border}`}
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
