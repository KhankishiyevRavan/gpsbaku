import { useSearchParams } from "react-router";
import PageBreadcrumbSub from "../../components/common/PageBreadCrumbSub";
import PageMeta from "../../components/common/PageMeta";
import PaymentForm from "../Forms/PaymentFrom";

export default function PaymentComplete() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");

  return (
    <div>
      <PageMeta
        title="GPSBAKU.AZ | Form Elements Dashboard"
        description="This is GPSBAKU.AZ Form Elements Dashboard page"
      />
      <PageBreadcrumbSub
        subTitle="Ödəniş et"
        pageTitleSrc="/sales"
        pageTitle="Ödənişlər"
        modelName="Ödəniş xidmətləri"
        subTwoTitle="Ödəniş əlavə et"
        subTwoTitleSrc="/create-sale"
        subThreeTitle="Müqavilə üzrə ödəniş cədvəli"
        subThreeTitleSrc={`/sale-table/${userId}`}
      />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6">
          <PaymentForm />
        </div>
      </div>
    </div>
  );
}
