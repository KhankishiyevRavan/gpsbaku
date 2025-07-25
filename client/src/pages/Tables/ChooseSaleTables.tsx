import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import ChooseContractUser from "../ChooseContractUser";
import PageBreadcrumbSub from "../../components/common/PageBreadCrumbSub";

export default function ChooseSaleTables() {
  return (
    <>
      <PageMeta
        title="GPSBAKU.AZ | Satış üçün istifadəçi seçmə"
        description="This is GPSBAKU.AZ Kontrak List Tables Dashboard page"
      />
      <PageBreadcrumbSub
        modelName="Ödəniş xidmətləri"
        pageTitle={`Ödənişlər`}
        subTitle="Ödəniş əlavə et"
        pageTitleSrc="/sales"
      />
      <div className="space-y-6">
        <ComponentCard
          title={`Ödəniş əlavə edəcəyiniz istifadəçini siyahıdan seçin`}
        >
          <ChooseContractUser navigateBasePath="/sale-table" />
        </ComponentCard>
      </div>
    </>
  );
}
