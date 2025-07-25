import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumbSub from "../../components/common/PageBreadCrumbSub";
import PageMeta from "../../components/common/PageMeta";
import ContractForm from "../Forms/ContractForm";

export default function CreateContractPageMeta() {
  return (
    <div>
      <PageMeta
        title="GPSBAKU.AZ | Form Elements Dashboard"
        description="This is GPSBAKU.AZ Form Elements Dashboard page"
      />
      <PageBreadcrumbSub pageTitle="Müqavilə əlavə et" subTitle="Müqavilə əlavə etmə formu" pageTitleSrc="/create-contract" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6">
          <ComponentCard title={``}>
            <ContractForm />
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}
