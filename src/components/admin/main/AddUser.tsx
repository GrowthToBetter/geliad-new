"use client";

import React, { useState, useCallback } from "react";
import {  UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ModalUser from "./ModalUser";


// Types
interface AddUserProps {
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  disabled?: boolean;
}

export default function AddUser({ 
  variant = "default",
  size = "default",
  className,
  disabled = false
}: AddUserProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size={size}
        onClick={handleOpenModal}
        disabled={disabled}
        className={className}
        aria-label="Add new user"
      >
        <UserPlus className="mr-2 h-4 w-4" />
        Add User
      </Button>
      
      <ModalUser
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        data={null}
      />
    </>
  );
}