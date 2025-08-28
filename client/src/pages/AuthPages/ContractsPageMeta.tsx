import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Contracts from "../Contracts";

export default function ContractsPageMeta() {
  return (
    <div>
      <PageMeta
        title="GPSBAKU.AZ | Form Elements Dashboard"
        description="This is GPSBAKU.AZ Form Elements Dashboard page"
      />
      <PageBreadcrumb pageTitle="Müqavilə siyahısı" modelName="Müqavilələr"/>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6">
          <ComponentCard title={``}>
            <Contracts />
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}
