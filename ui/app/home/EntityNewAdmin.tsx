import React, { useState, useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { fetchEntities, getAllAdmins } from "utils";
import { saveNewAdmin } from "utils";
import type { IEntity } from "utils/interfaces";
import { useAdminsStore } from "stores/user";

interface Prompt {
  setSelectedAdmin: (admin: IEntity) => void;
}

const EntityNewAdmin: React.FC<Prompt> = ({ setSelectedAdmin }) => {
  const [options, setOptions] = useState<IEntity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const setAdmins = useAdminsStore((state) => state.setAdmins);

  const loadMoreOptions = async () => {
    setLoading(true);
    const newOptions = await fetchEntities(page, 5);
    setOptions((prev) => [...prev, ...newOptions]);
    setLoading(false);
  };

  useEffect(() => {
    loadMoreOptions();
  }, [page]);

  const handleScroll = (event: React.SyntheticEvent) => {
    const listboxNode = event.currentTarget;
    if (
      listboxNode.scrollTop + listboxNode.clientHeight >=
      listboxNode.scrollHeight
    ) {
      setPage((prev) => prev + 1);
    }
  };

//   const handleSelectEntity = async (
//     event: React.SyntheticEvent,
//     value: IEntity | null
//   ) => {
//     if (value) {
//       try {
//         const response = await saveNewAdmin(value);
//         if (response?.status === 200) {
//           setAdmins(await getAllAdmins());
//           alert(`Entity ${value.firstName} ${value.lastName} added as Admin`);
//         }
//       } catch (error) {
//         console.error("Error saving new admin:", error);
//         alert("There was an error while adding the admin.");
//       }
//     }
//   };

  return (
    <Autocomplete
      style={{ width: "80%" }}
      options={options}
      getOptionLabel={(option) =>
        option.firstName + " " + option.lastName || ""
      }
      getOptionKey={(option) => option._id}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Select Entity"
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      ListboxProps={{
        onScroll: handleScroll,
        style: { maxHeight: 200, overflow: "auto" },
      }}
      //   onChange={handleSelectEntity}
      onChange={(event, value) => {value && setSelectedAdmin(value);}}
    />
  );
};

export default EntityNewAdmin;
