import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import PackagesTable from "../../components/tables/PackagesTable";

export default function Packages() {
  return (
    <div>
      <PageMeta
        title="GPSBAKU.AZ | Form Elements Dashboard"
        description="This is GPSBAKU.AZ Form Elements Dashboard page"
      />
      <PageBreadcrumb pageTitle="Paketlər siyahısı" modelName="Xidmət Paketlər"/>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6">
          <PackagesTable />
        </div>
      </div>
    </div>
  );
}
