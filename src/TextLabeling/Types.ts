export type Label = {
  color: string;
  label: string;
};

export type TextLabel = {
  start: number;
  end: number;
  label: string;
};

export type TextLabelingProps = {
  labels: Label[];
  text: string;
  labeling: TextLabel[];
  onChange: (value: TextLabel[]) => void;
};
