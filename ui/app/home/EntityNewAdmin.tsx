import React, { useState, useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { fetchEntities } from "utils";
import type { IEntity } from "utils/interfaces";

const EntityNewAdmin: React.FC = () => {
    const [options, setOptions] = useState<IEntity[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);

    const loadMoreOptions = async () => {
        setLoading(true);
        const newOptions = await fetchEntities(page, 10);
        setOptions((prev) => [...prev, ...newOptions]);
        setLoading(false);
    };

    useEffect(() => {
        loadMoreOptions();
    }, [page]);

    const handleScroll = (event: React.SyntheticEvent) => {
        const listboxNode = event.currentTarget;
        if (listboxNode.scrollTop + listboxNode.clientHeight >= listboxNode.scrollHeight) {
            setPage((prev) => prev + 1); // טען את העמוד הבא
        }
    };

    return (
        <Autocomplete
        style={{ width: "80%" }}
            options={options}
            getOptionLabel={(option) => option.firstName + " " + option.lastName || ""}
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
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
            ListboxProps={{
                onScroll: handleScroll,
                style: { maxHeight: 200, overflow: "auto" }, // כדי לאפשר גלילה
            }}
        />
    );
};

export default EntityNewAdmin;




