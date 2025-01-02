import DocLayout from "../layout/DocLayout";
import SideBar from "../layout/SideBar";

export default function FuncPage() {
  return (
    <>
      <DocLayout>
        <SideBar endPoint="func">
          <div></div>
        </SideBar>
      </DocLayout>
    </>
  );
}
