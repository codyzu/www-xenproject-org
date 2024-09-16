import React, { FC } from "react";
import "./ImageGallery.scss";

type Props = {
  className?: string;
  images: any;
  path: string;
};

const ImageGallery: FC<Props> = ({ className = "", images, path }) => {
  const [view, setView] = React.useState("mosaic");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [toastClass, setToastClass] = React.useState("");

  const handleViewChange = (view: string) => {
    setView(view);
  };

  const handleSearch = (e: React.SyntheticEvent<HTMLInputElement>) => {
    setSearchTerm((e.target as HTMLInputElement).value);
  };

  const handleCopy = (path: string) => {
    navigator.clipboard.writeText(path);
    showToast();
  };

  const showToast = () => {
    setToastClass("story-image-gallery_toast--appear");
    setTimeout(() => {
      setToastClass("story-image-gallery_toast--disappear");
    }, 2000);
  };

  const handleToastAnimationEnd = (e: React.AnimationEvent<HTMLDivElement>) => {
    const toast = e.target as HTMLDivElement;
    if (toast.classList.contains("story-image-gallery_toast--disappear")) {
      setToastClass("");
    }
  };

  const searchTermsArray = searchTerm.split(" ");
  const imagesFiltered = Object.keys(images).reduce((acc, group) => {
    acc[group] = images[group].filter((image) =>
      searchTermsArray.every((searchTerm) =>
        image.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
    if (acc[group].length === 0) delete acc[group];
    return acc;
  }, {});

  return (
    <div className={`${className}`}>
      {toastClass != "" ? (
        <div
          className={`story-image-gallery_toast ${toastClass}`}
          onAnimationEnd={handleToastAnimationEnd}
        >
          <div className="story-image-gallery_toast_message">
            Copied to clipboard
          </div>
        </div>
      ) : null}
      <div className="story-image-gallery_toolbar">
        <input
          type="search"
          placeholder="Search"
          className="input input--text sb-search-input"
          onChange={handleSearch}
          onClick={handleSearch}
        />
        <button
          className={`mosaicBtn ${view === "mosaic" ? "active" : ""}`}
          onClick={() => handleViewChange("mosaic")}
        >
          <svg viewBox="0 0 24 24">
            <path d="M3 3h8v8H3V3zm0 10h8v8H3v-8zM13 3h8v8h-8V3zm0 10h8v8h-8v-8z" />
          </svg>
        </button>
        <button
          className={`listBtn ${view === "list" ? "active" : ""}`}
          onClick={() => handleViewChange("list")}
        >
          <svg viewBox="0 0 24 24">
            <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
          </svg>
        </button>
      </div>

      <div>
        {Object.keys(imagesFiltered).map((group) => (
          <div key={group} className={`story-image-gallery ${view}`}>
            <h2>{group}</h2>

            <div className="story-image-gallery_content">
              <div className="story-image-gallery_table">
                <div className="story-image-gallery_tr story-image-gallery_head">
                  <div className="story-image-gallery_th">Image</div>
                  <div className="story-image-gallery_th">Name</div>
                  <div className="story-image-gallery_th">Path</div>
                </div>
                {imagesFiltered[group].map((image) => (
                  <div key={image.name} className="story-image-gallery_tr">
                    <div className="story-image-gallery_td">
                      <img src={path + image.path} alt={image.name} />
                    </div>
                    <div className="story-image-gallery_td">
                      <strong>{image.name}</strong>
                    </div>
                    <div className="story-image-gallery_td">
                      {path + image.path}
                      <input
                        type="button"
                        value="Copy"
                        onClick={() => handleCopy(path + image.path)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
