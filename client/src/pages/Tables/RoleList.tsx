import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import OperatorsTable from "../../components/tables/OperatorsTable";

export default function OperatorList() {
  return (
    <>
      <PageMeta
        title="GPSBAKU.AZ | Roles List Tables"
        description="This is GPSBAKU.AZ Roles List Tables Dashboard page"
      />
      <PageBreadcrumb pageTitle="Roles List Tables" />
      <div className="space-y-6">
        <ComponentCard title="Roles List">
          <OperatorsTable />
        </ComponentCard>
      </div>
    </>
  );
}
