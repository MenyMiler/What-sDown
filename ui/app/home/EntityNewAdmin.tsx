import React, { useState, useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { fetchEntities } from "utils";
import type { IEntity } from "utils/interfaces";
import i18next from "i18next";

interface Prompt {
  setSelectedAdmin: (admin: IEntity) => void;
}

const EntityNewAdmin: React.FC<Prompt> = ({ setSelectedAdmin }) => {
  const [options, setOptions] = useState<IEntity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);

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
          label={i18next.t("labels.select_admin")}
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
      onChange={(event, value) => {value && setSelectedAdmin(value);}}
    />
  );
};

export default EntityNewAdmin;
