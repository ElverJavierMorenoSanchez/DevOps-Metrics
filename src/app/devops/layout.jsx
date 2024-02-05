import Aside from "@/components/Aside/Aside";

const DevOpsLayout = ({ children }) => {
  return (
    <div className="flex flex-row">
      <Aside />
      {children}
    </div>
  );
};

export default DevOpsLayout;
