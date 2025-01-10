
"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import { FileFullPayload } from "@/utils/relationsip";
import { useRouter } from "next/navigation";
import { SearchInput } from "../../karya/components/input";
import { FileCard } from "../../karya/components/card";
import { MainProps } from "../../karya/components/Hero";
import { addViews } from "@/utils/server-action/userGetServerSession";

const Main: React.FC<MainProps> = ({
  ListData,
  currentUser
}) => {
  const [searchInput, setSearchInput] = useState<string>("");
  const [filteredUser, setFilteredUser] = useState<FileFullPayload[]>(ListData);
  const router = useRouter();

  useEffect(() => {
    const filterUsers = () => {
      const filteredByName = searchInput === "" ? ListData : ListData.filter((file: FileFullPayload) =>
        file.filename.toLowerCase().includes(searchInput.toLowerCase())
      );
      setFilteredUser(filteredByName);
    };

    filterUsers();
  }, [ListData, searchInput]);

  const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };


  return (
    <section className="max-w-full mx-auto xl:mx-48 md:flex gap-x-4 px-4 xl:px-0">
      <div className="block md:hidden mb-4">
        <SearchInput
          value={searchInput}
          onChange={handleSearchInput}
          isMobile
        />
      </div>

      <div className="w-full">
        <div className="hidden md:block">
          <SearchInput value={searchInput} onChange={handleSearchInput} />
        </div>

        {filteredUser.length > 0 ? (
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 bg-white rounded-xl p-8 mt-4">
            {filteredUser.map((file, i) => (
              <FileCard
                key={i}
                file={file}
                validate
                notif
                onRead={() => {
                  router.push(file.path);
                  addViews(file.id, file.views + 1);
                }}
                user={currentUser}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white px-2 py-10">
            <h1 className="text-center text-xl">Oops! Data Tidak Ditemukan</h1>
          </div>
        )}
      </div>
    </section>
  );
};

export default Main;
