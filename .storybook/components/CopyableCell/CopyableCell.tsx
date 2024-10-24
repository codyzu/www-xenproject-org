import React from "react";
import StoryCopyButton from "../StoryCopyButton";
import "./CopyableCell.scss";

export const CopyableCell = ({ prefix, name }) => (
  <td className="copyable-cell">
    <StoryCopyButton textToCopy={`${prefix || ""}${name}`} />
    <span>{`${prefix || ""}${name}`}</span>
  </td>
);

export default CopyableCell;
