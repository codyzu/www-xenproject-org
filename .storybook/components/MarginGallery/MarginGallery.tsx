import React, { FC } from "react";
import "./MarginGallery.scss";

type StyleObject = {
  [key: string]: string | number;
};

type Props = {
  className?: string;
  children?: React.ReactNode;
  base: number;
  properties: StyleObject;
  directions: StyleObject;
  sizes: StyleObject;
};

const MarginGallery: FC<Props> = ({ properties, directions, sizes, base, className = "" }) => {
  const propertiesArray = Object.entries(properties);
  const directionsArray = Object.entries(directions);
  const sizesArray = Object.entries(sizes).sort((a, b) => a[1] - b[1]);

  return (
    <div className={`margin-gallery ${className}`}>
      <h2>Margins / Paddings / Gap</h2>
      <table>
        <tr>
          <th>gap</th>
          <td>gap</td>
        </tr>
        {propertiesArray.map(([marginKey, marginValue]: any, index) =>
          directionsArray.map(([directionKey, directionValue]: any, index) => (
            <tr>
              <th>.{marginKey + directionKey}</th>
              <td>
                {directionValue
                  .split(" ")
                  .map((val: string) => marginValue + "-" + val)
                  .join(", ")}
              </td>
            </tr>
          ))
        )}
      </table>
      <h2>Values</h2>
      <table>
        {sizesArray.map(([sizeKey, sizeValue]: any, index) => (
          <tr>
            <th>{sizeKey}</th>
            <td>{sizeValue}px</td>
          </tr>
        ))}
      </table>

      <h2>All classes</h2>
      <table className="fixed">
        {sizesArray.map(([sizeKey, sizeValue]: any, index) => (
          <tr>
            <>
              {propertiesArray.map(([marginKey, marginValue]: any, index) => (
                <>
                  {directionsArray.map(([directionKey, directionValue]: any, index) => (
                    <td>{marginKey + directionKey + "-" + sizeKey}</td>
                  ))}
                </>
              ))}
              <td>gap-{sizeKey}</td>
              <td>
                <strong>{sizeValue}px</strong>
              </td>
            </>
          </tr>
        ))}
      </table>

      <h2>Visual sizes</h2>

      <div className="margin-gallery__visual">
        {sizesArray.map(([sizeKey, sizeValue]: any, index) => (
          <div className="margin-gallery__visual__item">
            <div className="margin-gallery__visual__item__label">{sizeKey}</div>
            <div className="margin-gallery__visual__item__content" style={{ width: sizeValue }}></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarginGallery;
