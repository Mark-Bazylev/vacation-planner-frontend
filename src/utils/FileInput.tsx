import React, { useState, ChangeEvent, forwardRef, LegacyRef } from "react";
import { Box, Button, FormHelperText, Stack, Typography } from "@mui/material";
import { UseFormRegisterReturn } from "react-hook-form/dist/types/form";

interface InputProps extends Omit<UseFormRegisterReturn<"imageFile">, "ref"> {
  onFileInput: (url: File) => void;
  vacationImage?: string;
}
const FileInput = forwardRef((props: InputProps, ref) => {
  const { onFileInput, vacationImage, onChange, ...rest } = props;
  const [imageUrl, setImageUrl] = useState("");
  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const selectedImage = e.target.files?.[0] || null;
    if (selectedImage) {
      setImageUrl(URL.createObjectURL(selectedImage));
      onFileInput(selectedImage);
      onChange(e);
    }
  }

  return (
    <Stack
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 1,
        my: 1,
        border: "1px solid rgba(0, 0, 0, 0.23)",
        borderRadius: "4px",
      }}
    >
      <input
        ref={ref as LegacyRef<HTMLInputElement>}
        accept="image/*"
        type="file"
        id="select-image"
        style={{ display: "none" }}
        onChange={handleInputChange}
        {...rest}
      />
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <Typography sx={{ mr: 2 }} variant={"h6"}>
          Cover Image:
        </Typography>
        <label htmlFor="select-image">
          <Button variant="contained" color="primary" component="span">
            Upload Image
          </Button>
        </label>
      </Box>

      {imageUrl && (
        <Box mt={2} textAlign="center">
          <img src={imageUrl} height="200px" />
        </Box>
      )}
      {vacationImage && !imageUrl && (
        <Box mt={2} textAlign="center">
          <img src={process.env.REACT_APP_IMAGE_URL + vacationImage} height="200px" />
        </Box>
      )}
    </Stack>
  );
});

export default FileInput;
