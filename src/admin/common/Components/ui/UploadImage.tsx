import {
  Avatar,
  Box,
  Button,
  Field,
  FileUpload,
  Icon,
  VStack,
} from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";
import { LuUpload } from "react-icons/lu";

interface IProps {
  fieldName: string;
  fallbackImage: string;
  disabled?: boolean;
}

const UploadImage = ({
  fieldName,
  fallbackImage,
  disabled = false,
}: IProps) => {
  const {
    control,
    getValues,
    formState: { errors },
  } = useFormContext();
  const existData = getValues("id");
  const currentFile = getValues(fieldName);
  return (
    <VStack mb={5} w={"full"} h={"329px"}>
      <Controller
        control={control}
        name={fieldName}
        disabled={disabled}
        rules={{
          validate: (file) =>
            file instanceof File && file.size >= 5 * 1024 * 1024
              ? "Max file size is 5MB"
              : true,
        }}
        render={({ field }) => {
          const previewUrl =
            field.value instanceof File
              ? URL.createObjectURL(field.value)
              : field.value?.url
                ? `${import.meta.env.VITE_SERVER_URL}${field.value?.url}`
                : null;

          return (
            <>
              {/* Preview OR Upload */}
              {previewUrl ? (
                <Avatar.Root boxSize="260px" objectFit="cover">
                  <Avatar.Image
                    src={previewUrl}
                    alt={field.value.alternativeText}
                  />
                  <Avatar.Fallback name={field.value.name} />
                </Avatar.Root>
              ) : disabled ? (
                <Avatar.Root boxSize="260px">
                  <Avatar.Fallback
                    name={control._defaultValues[fallbackImage]}
                  />
                </Avatar.Root>
              ) : (
                <Field.Root invalid={!!errors[fieldName]}>
                  <FileUpload.Root
                    h="260px"
                    alignItems="stretch"
                    disabled={disabled}
                    accept={{ "image/*": [".png", ".jpg", ".jpeg"] }}
                    onFileAccept={({ files }) => {
                      const file = files[0];
                      if (!file) return;
                      field.onChange(file);
                    }}
                  >
                    <FileUpload.HiddenInput />

                    <FileUpload.Dropzone
                      border={errors[fieldName] && "input-border"}
                    >
                      <Icon size="md" color="fg.muted">
                        <LuUpload />
                      </Icon>

                      <FileUpload.DropzoneContent>
                        <Box>Drag and drop files here</Box>
                        <Box color="fg.muted">.png, .jpg up to 5MB</Box>
                        <Field.ErrorText>
                          {typeof errors[fieldName]?.message === "string"
                            ? errors[fieldName].message
                            : null}
                        </Field.ErrorText>
                      </FileUpload.DropzoneContent>
                    </FileUpload.Dropzone>
                  </FileUpload.Root>
                </Field.Root>
              )}
              {/* Actions */}
              {field.value?.name ? (
                <Box mt={3}>
                  <Button
                    variant="solid"
                    colorPalette="blue"
                    onClick={() => {
                      field.onChange(null);
                    }}
                  >
                    Change user image
                  </Button>
                </Box>
              ) : existData && currentFile ? (
                <Box mt={3}>
                  <Button
                    variant="outline"
                    onClick={() => {
                      field.onChange(currentFile);
                    }}
                  >
                    Cancel changes
                  </Button>
                </Box>
              ) : null}
            </>
          );
        }}
      />
    </VStack>
  );
};

export default UploadImage;
