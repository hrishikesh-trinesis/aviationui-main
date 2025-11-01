const GeneralTab = ({
  dataMap,
  handleChange,
  validateDataType,
  validateLen,
  errors,
  disabledField,
}) => {
  // Country codes list
  const countryCodes = [
    { code: "+1", country: "USA/Canada" },
    { code: "+44", country: "UK" },
    { code: "+91", country: "India" },
    { code: "+86", country: "China" },
    { code: "+81", country: "Japan" },
    { code: "+49", country: "Germany" },
    { code: "+33", country: "France" },
    { code: "+39", country: "Italy" },
    { code: "+61", country: "Australia" },
    { code: "+971", country: "UAE" },
    { code: "+65", country: "Singapore" },
    { code: "+82", country: "South Korea" },
    { code: "+7", country: "Russia" },
    { code: "+55", country: "Brazil" },
    { code: "+27", country: "South Africa" },
    { code: "+52", country: "Mexico" },
    { code: "+34", country: "Spain" },
    { code: "+31", country: "Netherlands" },
    { code: "+46", country: "Sweden" },
    { code: "+41", country: "Switzerland" },
  ];

  function validateMailId(event) {
    const email = event.target.value;
    const emailValidator = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailValidator.test(email)) {
      event.target.classList.add("is-invalid");
      event.target.classList.remove("is-valid");
    } else {
      event.target.classList.remove("is-invalid");
      event.target.classList.add("is-valid");
    }
  }

  return (
    <div className="m-2 p-2 mt-2">
      {/* Supplier/Sub-Contractor Details */}
      <div className="col-md-10 mb-1 d-flex">
        <div className="col-md-6">
          <div className="row">
            <label className="col-md-8 pt-2" htmlFor="supplierName">
              Supplier/Sub-Contractor Name
              <span className="text-danger mx-1 " style={{ fontSize: "17px" }}>
                *
              </span>
            </label>
            <input
              className="col-md-6 form-control uniform-input"
              type="text"
              name="supplierName"
              id="supplierName"
              placeholder="Supplier/Sub-Contractor Name"
              value={dataMap.supplierName}
              onChange={handleChange}
              onInput={(event) => {
                validateDataType(event, "A");
              }}
              disabled={disabledField}
            />
          </div>
          {errors.supplierName && (
            <div className="col-6" style={{ color: "red", textAlign: "end" }}>
              {errors.supplierName}
            </div>
          )}
        </div>

        {/* Payment Terms */}
        <div className="col-md-10 d-flex mb-3">
          <div
            className="col-md-9 d-flex pt-2"
            style={{ alignItems: "center", justifyContent: "center" }}
          >
            <label className="col-md-4 pt-2">Select Payment Terms</label>
            {/* 30 Days */}
            <div className="form-check mx-3 p-0">
              <input
                className="form-check-input"
                type="radio"
                id="paymentTerms30"
                name="paymentTerms"
                value="30"
                checked={dataMap.paymentTerms === "30"}
                onChange={handleChange}
                disabled={disabledField}
              />
              <label className="form-check-label pt-1" htmlFor="paymentTerms30">
                30 Days
              </label>
            </div>

            {/* 60 Days */}
            <div className="form-check mx-3 p-0">
              <input
                className="form-check-input"
                type="radio"
                id="paymentTerms60"
                name="paymentTerms"
                value="60"
                checked={dataMap.paymentTerms === "60"}
                onChange={handleChange}
                disabled={disabledField}
              />
              <label className="form-check-label pt-1" htmlFor="paymentTerms60">
                60 Days
              </label>
            </div>

            {/* 90 Days */}
            <div className="form-check mx-3 p-0">
              <input
                className="form-check-input"
                type="radio"
                id="paymentTerms90"
                name="paymentTerms"
                value="90"
                checked={dataMap.paymentTerms === "90"}
                onChange={handleChange}
                disabled={disabledField}
              />
              <label className="form-check-label pt-1" htmlFor="paymentTerms90">
                90 Days
              </label>
            </div>

            {/* Advance Pay */}
            <div className="form-check mx-3 p-0">
              <input
                className="form-check-input"
                type="radio"
                id="paymentTermsAdvance"
                name="paymentTerms"
                value="Advance Pay"
                checked={dataMap.paymentTerms === "Advance Pay"}
                onChange={handleChange}
                disabled={disabledField}
              />
              <label
                className="form-check-label pt-1"
                htmlFor="paymentTermsAdvance"
              >
                Advance Pay
              </label>
            </div>
          </div>
        </div>
      </div>

      <hr className="mx-0 my-2 p-0 border" />

      {/* Contact Details */}
      <div
        className="col-md-12 d-flex mb-1"
        style={{ justifyContent: "space-between" }}
      >
        {/* Phone Number with Country Code */}
        <div className="col-md-5">
          <div className="row">
            <label className="col-md-6" htmlFor="phoneNumber">
              Phone Number
              <span className="text-danger mx-1" style={{ fontSize: "17px" }}>
                *
              </span>
            </label>
            <div className="col-md-12 d-flex" style={{ gap: "5px" }}>
              <select
                className="form-select"
                name="countryCode"
                value={dataMap.countryCode}
                onChange={handleChange}
                disabled={disabledField}
                style={{ width: "150px", height: "38px" }}
              >
                <option value="" disabled>
                  Country Code
                </option>
                {countryCodes.map((item) => (
                  <option key={item.code} value={item.code}>
                    {`${item.code} - ${item.country}`}
                  </option>
                ))}
              </select>

              <input
                className="form-control uniform-input"
                type="number"
                name="phoneNumber"
                id="phoneNumber"
                placeholder="Enter Number"
                value={dataMap.phoneNumber}
                onChange={handleChange}
                onInput={(event) => {
                  validateDataType(event, "N");
                  validateLen(event, 10, 10);
                }}
                disabled={disabledField}
                style={{ flex: 1 }}
              />
            </div>
          </div>
          {(errors.phoneNumber || errors.countryCode) && (
            <div className="col-6" style={{ color: "red", textAlign: "end" }}>
              {errors.countryCode}
              {errors.phoneNumber}
            </div>
          )}
        </div>

        <div className="col-md-5">
          <div className="row">
            <label className="col-md-4 pt-2" htmlFor="faxNum">
              Fax Number
            </label>
            <input
              className="col-md-8 form-control uniform-input"
              type="number"
              name="faxNum"
              id="faxNum"
              placeholder="Fax Number"
              value={dataMap.faxNum}
              onChange={handleChange}
              disabled={disabledField}
            />
          </div>
        </div>
      </div>

      {/* Email & Address */}
      <div
        className="col-md-12 d-flex mb-3"
        style={{ justifyContent: "space-between" }}
      >
        <div className="col-md-5">
          <div className="row">
            <label className="col-md-4 pt-2" htmlFor="email">
              Email ID
              <span className="text-danger mx-1" style={{ fontSize: "17px" }}>
                *
              </span>
            </label>
            <input
              className="col-md-8 form-control uniform-input"
              type="email"
              name="email"
              id="email"
              placeholder="Email ID"
              value={dataMap.email}
              onChange={handleChange}
              onInput={(event) => {
                validateMailId(event);
              }}
              required
              disabled={disabledField}
            />
          </div>
          {errors.email && (
            <div className="col-6" style={{ color: "red", textAlign: "end" }}>
              {errors.email}
            </div>
          )}
        </div>
        <div className="col-md-5">
          <div className="row">
            <label className="col-md-4 pt-2" htmlFor="address">
              Address
              <span className="text-danger mx-1" style={{ fontSize: "17px" }}>
                *
              </span>
            </label>
            <input
              className="col-md-8 form-control uniform-input"
              type="text"
              name="address"
              id="address"
              placeholder="Address"
              value={dataMap.address}
              onChange={handleChange}
              onInput={(event) => {
                validateLen(event, 1, 150);
              }}
              disabled={disabledField}
            />
          </div>
          {errors.address && (
            <div className="col-6" style={{ color: "red", textAlign: "end" }}>
              {errors.address}
            </div>
          )}
        </div>
      </div>

      <hr className="mx-0 my-2 p-0 border " />

      {/* Quality Manager Details */}
      <h5 className="mb-3 fw-bold text-dark">Quality Manager Details</h5>
      <div
        className="col-md-12 d-flex"
        style={{ justifyContent: "space-between" }}
      >
        <div className="col-md-5">
          <div className="row">
            <label className="col-md-4 pt-2" htmlFor="qualityManagerName">
              Name
            </label>
            <input
              className="col-md-8 form-control uniform-input"
              type="text"
              name="qualityManagerName"
              id="qualityManagerName"
              placeholder="Quality Manager Name"
              value={dataMap.qualityManagerName}
              onChange={handleChange}
              onInput={(event) => {
                if (event.target.value.trim() !== "") {
                  validateDataType(event, "A");
                  validateLen(event, 0, 30);
                }
              }}
              disabled={disabledField}
            />
          </div>
          {dataMap.qualityManagerName && errors.qualityManagerName && (
            <div className="col-6" style={{ color: "red", textAlign: "end" }}>
              {errors.qualityManagerName}
            </div>
          )}
        </div>

        {/* Quality Manager Phone with Country Code */}
        <div className="col-md-5">
          <div className="row">
            <label
              className="col-md-8 pt-2"
              htmlFor="qualityManagerPhoneNumber"
            >
              Phone Number
            </label>
            <div className="col-md-12 d-flex" style={{ gap: "5px" }}>
              <select
                className="form-select"
                name="qualityManagerCountryCode"
                value={dataMap.qualityManagerCountryCode}
                onChange={handleChange}
                disabled={disabledField}
                style={{ width: "150px", height: "38px" }}
              >
                {" "}
                <option value="">
                  Country Code
                </option>
                {countryCodes.map((item) => (
                  <option key={item.code} value={item.code}>
                    {`${item.code} - ${item.country}`}
                  </option>
                ))}
              </select>
              <input
                className="form-control uniform-input"
                type="number"
                name="qualityManagerPhoneNumber"
                id="qualityManagerPhoneNumber"
                placeholder="Enter Number"
                value={dataMap.qualityManagerPhoneNumber}
                onChange={handleChange}
                onInput={(event) => {
                  if (event.target.value.trim() !== "") {
                    validateDataType(event, "N");
                    validateLen(event, 0, 10);
                  }
                }}
                disabled={disabledField}
                style={{ flex: 1 }}
              />
            </div>
          </div>
          {errors.qualityManagerPhoneNumber && (
            <div className="col-6" style={{ color: "red", textAlign: "end" }}>
              {errors.qualityManagerPhoneNumber}
            </div>
          )}
        </div>
      </div>
      <div className="col-md-12">
        <div className="col-md-5">
          <div className="row">
            <label className="col-md-4 pt-2" htmlFor="qualityManagerEmailId">
              Email ID
            </label>
            <input
              className="col-md-8 form-control uniform-input"
              type="email"
              name="qualityManagerEmailId"
              id="qualityManagerEmailId"
              placeholder="Quality Manager Email"
              value={dataMap.qualityManagerEmailId}
              onChange={handleChange}
              onInput={(event) => {
                if (event.target.value.trim() !== "") {
                  validateMailId(event);
                }
              }}
              disabled={disabledField}
            />
          </div>
          {errors.qualityManagerEmailId && (
            <div className="col-6" style={{ color: "red", textAlign: "end" }}>
              {errors.qualityManagerEmailId}
            </div>
          )}
        </div>
      </div>

      <hr className="mx-0 my-2 p-0 border " />

      {/* Sales Representative Details */}
      <h5 className="mb-3 fw-bold text-dark">Sales Representative Details</h5>
      <div
        className="col-md-12 d-flex"
        style={{ justifyContent: "space-between" }}
      >
        <div className="col-md-5">
          <div className="row">
            <label className="col-md-4 pt-2" htmlFor="saleRepresentativeName">
              Name
              <span className="text-danger mx-1" style={{ fontSize: "17px" }}>
                *
              </span>
            </label>
            <input
              className="col-md-8 form-control uniform-input"
              type="text"
              name="saleRepresentativeName"
              id="saleRepresentativeName"
              placeholder="Sales Representative Name"
              value={dataMap.saleRepresentativeName}
              onChange={handleChange}
              onInput={(event) => {
                validateDataType(event, "A");
                validateLen(event, 0, 100);
              }}
              disabled={disabledField}
            />
          </div>
          {errors.saleRepresentativeName && (
            <div className="col-6" style={{ color: "red", textAlign: "end" }}>
              {errors.saleRepresentativeName}
            </div>
          )}
        </div>
        <div className="col-md-5">
          <div className="row">
            <label
              className="col-md-4 pt-2"
              htmlFor="saleRepresentativeEmailId"
            >
              Email ID
              <span className="text-danger mx-1" style={{ fontSize: "17px" }}>
                *
              </span>
            </label>
            <input
              className="col-md-8 form-control uniform-input"
              type="email"
              name="saleRepresentativeEmailId"
              id="saleRepresentativeEmailId"
              placeholder="Sales Representative Email"
              value={dataMap.saleRepresentativeEmailId}
              onChange={handleChange}
              onInput={(event) => {
                validateMailId(event);
              }}
              disabled={disabledField}
              required
            />
          </div>
          {errors.saleRepresentativeEmailId && (
            <div className="col-6" style={{ color: "red", textAlign: "end" }}>
              {errors.saleRepresentativeEmailId}
            </div>
          )}
        </div>
      </div>

      {/* Sales Representative Phone with Country Code */}
      <div className="col-md-12 mb-2">
        <div className="col-md-6">
          <div className="row">
            <label
              className="col-md-8 pt-2"
              htmlFor="saleRepresentativePhoneNumber"
            >
              Phone Number
              <span className="text-danger mx-1" style={{ fontSize: "17px" }}>
                *
              </span>
            </label>
            <div className="col-md-10 d-flex" style={{ gap: "5px" }}>
              <select
                className="form-select"
                name="saleRepresentativeCountryCode"
                value={dataMap.saleRepresentativeCountryCode}
                onChange={handleChange}
                disabled={disabledField}
                style={{ width: "150px", height: "38px" }}
              >
                <option value="" disabled>
                  Country Code
                </option>
                {countryCodes.map((item) => (
                  <option key={item.code} value={item.code}>
                    {`${item.code} - ${item.country}`}
                  </option>
                ))}
              </select>
              <input
                className="form-control uniform-input"
                type="number"
                name="saleRepresentativePhoneNumber"
                id="saleRepresentativePhoneNumber"
                placeholder="Enter Number"
                value={dataMap.saleRepresentativePhoneNumber}
                onChange={handleChange}
                onInput={(event) => {
                  validateDataType(event, "N");
                  validateLen(event, 10, 10);
                }}
                disabled={disabledField}
                style={{ flex: 1 }}
              />
            </div>
          </div>
          {(errors.saleRepresentativePhoneNumber ||
            errors.saleRepresentativeCountryCode) && (
            <div className="col-6" style={{ color: "red", textAlign: "end" }}>
              {errors.saleRepresentativePhoneNumber}
              {errors.saleRepresentativeCountryCode}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneralTab;
