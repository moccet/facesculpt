import styles from "./PreorderNote.module.css";

export function PreorderNote() {
  return (
    <section className={styles.wrap} id="preorder">
      <div className="container">
        <h2>Pre-order, in plain English.</h2>
        <p>
          Card is taken at the order. Stock ships from launch. Tracking emailed when the parcel leaves the warehouse.
          Standard return window applies once stock arrives. Members ten per cent off, applied at checkout when
          signed in. Member rate is excluded on gift vouchers and on items already in the seasonal sale.
        </p>
      </div>
    </section>
  );
}
