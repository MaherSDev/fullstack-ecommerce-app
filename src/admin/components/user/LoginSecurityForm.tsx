import axiosInstance from "@/api/axios.config";
import type { IRole, IUserData } from "@/interfaces";
import CookieService from "@/services/CookieService";
import { Field, For, NativeSelect, Switch } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

const LoginSecurityForm = () => {
  const [roles, setRoles] = useState<IRole[]>([]);

  const {
    control,
    formState: { errors },
  } = useFormContext<IUserData>();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const { data } = await axiosInstance.get("users-permissions/roles", {
          headers: {
            Authorization: `Bearer ${CookieService.get("jwt")}`,
          },
        });
        setRoles(data.roles);
        return data;
      } catch (error: unknown) {
        return console.error(
          error instanceof Error ? error.message : "Error Fetching Roles",
        );
      }
    };
    fetchRoles();
  }, [control]);

  return (
    <>
      {/* Blocked */}
      <Controller
        control={control}
        name="blocked"
        render={({ field }) => (
          <Field.Root invalid={!!errors.blocked} py={2}>
            <Switch.Root
              name={field.name}
              colorPalette={"red"}
              checked={field.value}
              onCheckedChange={({ checked }) => {
                field.onChange(checked);
              }}
            >
              <Switch.Label>Block</Switch.Label>
              <Switch.HiddenInput onBlur={field.onBlur} />
              <Switch.Control />
            </Switch.Root>
            <Field.ErrorText>{errors.blocked?.message}</Field.ErrorText>
          </Field.Root>
        )}
      />
      {/* Role */}
      <Field.Root invalid={!!errors.role}>
        <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <>
              <Field.Label>Role</Field.Label>
              <NativeSelect.Root size="sm" width="240px">
                <NativeSelect.Field
                  placeholder="Select option"
                  value={field.value?.id}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                  borderColor={`${errors.role ? "red" : "input-border"}`}
                >
                  <For
                    each={roles.filter(
                      (role) => !["super_admin"].includes(role.type),
                    )}
                  >
                    {(role: IRole) => (
                      <option
                        key={role.id}
                        value={role.id}
                        disabled={field.value.id === role.id}
                      >
                        {role.name}
                      </option>
                    )}
                  </For>
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </>
          )}
        />
        <Field.ErrorText>{errors.role?.message}</Field.ErrorText>
      </Field.Root>
    </>
  );
};

export default LoginSecurityForm;
