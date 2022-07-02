import { useEffect, useState } from "react";
import ReactDOM from "react-dom";

type Props = React.ComponentPropsWithoutRef<"form"> & {
  id: string;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
};

/**
 * A form that renders outside of it's parent.
 *
 * This component is useful for elements that cannot contain forms such as a table.
 *
 * The form inputs and the submit button must have the form attribute set to the id of the form.
 *
 * @example <input type="text" form="my-form-id" />
 * @example <button type="submit" form="my-form-id" />
 */
function DetachedForm(props: Props) {
  const [didMount, setMount] = useState(false);

  useEffect(() => {
    setMount(typeof window !== "undefined");
  }, []);

  return didMount
    ? ReactDOM.createPortal(
        <form
          {...props}
          onSubmit={(event) => {
            event.preventDefault();
            props.onSubmit(event);
          }}
        />,
        document.body
      )
    : null;
}

export default DetachedForm;
