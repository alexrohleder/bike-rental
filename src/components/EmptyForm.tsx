import { useEffect, useState } from "react";
import ReactDOM from "react-dom";

type Props = React.ComponentPropsWithoutRef<"form"> & {
  id: string;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
};

function EmptyForm(props: Props) {
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

export default EmptyForm;
