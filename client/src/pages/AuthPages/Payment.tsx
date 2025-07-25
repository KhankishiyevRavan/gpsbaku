import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageBreadcrumbSub from "../../components/common/PageBreadCrumbSub";
import PageMeta from "../../components/common/PageMeta";
import PackagesTable from "../../components/tables/PackagesTable";
import PaymentTable from "../Forms/PaymentTable";

export default function Payment() {
  return (
    <div>
      <PageMeta
        title="GPSBAKU.AZ | Form Elements Dashboard"
        description="This is GPSBAKU.AZ Form Elements Dashboard page"
      />
      <PageBreadcrumbSub
        subTitle="Müqavilə üzrə ödəniş cədvəli"
        pageTitleSrc="/sales"
        pageTitle="Ödənişlər"
        modelName="Ödəniş xidmətləri"
        subTwoTitle="Ödəniş əlavə et"
        subTwoTitleSrc="/create-sale"
      />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6">
          <PaymentTable />
        </div>
      </div>
    </div>
  );
}
