import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Button } from "@mui/material";
import { fetchFilteredUsers } from "../store/productsSlice";
import { useDispatch } from "react-redux";

export const Filter = (props) => {
  const categories = props.states.categories || [];
  const [productCategories, setProductCategories] = React.useState("");
  const [priceRange, setPriceRange] = React.useState("");
  const [priceRangeQueryParam, setPriceRangeQueryParam] = React.useState("");
  const dispatch = useDispatch();

  const handleCategoryChangeHandler = (event) =>
    setProductCategories(event.target.value);
  const handlePriceChangeHandler = (event) => {
    const priceRange = event.target.value.split("-");
    const ageRangeQueryParam =
      "price=gte:" + priceRange[0] + "&price=lte:" + priceRange[1];
    setPriceRangeQueryParam(ageRangeQueryParam);
    setPriceRange(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      Filter state wise user
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label"></InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={productCategories}
          label="State"
          onChange={handleCategoryChangeHandler}
        >
          {categories.map((state, i) => {
            return (
              <MenuItem key={i} value={state}>
                {state}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      Filter age wise user
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label-age"></InputLabel>
        <Select
          labelId="demo-simple-select-label-age"
          id="demo-simple-select"
          value={priceRange}
          label="State"
          onChange={handlePriceChangeHandler}
        >
          <MenuItem value={"20-40"}>20-40</MenuItem>
          <MenuItem value={"40-60"}>40-60</MenuItem>
          <MenuItem value={"60-90"}>60-90</MenuItem>
        </Select>
      </FormControl>
      <Button
        sx={{ maxWidth: 1, width: 1 }}
        onClick={() => {
          let queryParams = "";
          if (productCategories !== "") {
            queryParams += "category=" + productCategories;
          }
          if (priceRange !== "") {
            if (productCategories !== "") {
              queryParams += "&";
            }
            queryParams += priceRangeQueryParam;
          }
          dispatch(fetchFilteredUsers(queryParams));
        }}
      >
        Search
      </Button>
    </Box>
  );
};
