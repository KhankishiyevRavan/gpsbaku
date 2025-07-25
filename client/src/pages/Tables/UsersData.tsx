import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import UsersDataTable from "../../components/tables/UsersDataTable";

export default function UsersData() {
  return (
    <>
      <PageMeta
        title="GPSBAKU.AZ | User List Tables"
        description="This is GPSBAKU.AZ Users List Tables Dashboard page"
      />
      <PageBreadcrumb pageTitle={`İstifadəçi siyahısı`} modelName="İstifadəçilər"/>
      <div className="space-y-6">
        {/* <ComponentCard title={``}> */}
          <UsersDataTable />
        {/* </ComponentCard> */}
      </div>
    </>
  );
}
