const Sidebar = () => {
  return (
    <div className="daisy-drawer lg:daisy-drawer-open">
      <input id="my-drawer-2" type="checkbox" className="daisy-drawer-toggle" />
      <div className="daisy-drawer-content flex flex-col items-center justify-center">
        {/* Page content here */}
        <label
          htmlFor="my-drawer-2"
          className="daisy-btn daisy-btn-primary daisy-drawer-button lg:hidden"
        >
          Open drawer
        </label>
      </div>
      <div className="daisy-drawer-side">
        <label htmlFor="my-drawer-2" className="daisy-drawer-overlay"></label>
        <ul className="daisy-menu bg-base-200 text-base-content min-h-full w-80 p-4">
          {/* Sidebar content here */}
          <li>
            <a>Sidebar Item 1</a>
          </li>
          <li>
            <a>Sidebar Item 2</a>
          </li>
        </ul>
      </div>
    </div>
  );
};
