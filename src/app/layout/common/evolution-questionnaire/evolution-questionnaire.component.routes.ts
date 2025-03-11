import { Routes } from "@angular/router";
import {EvaluationQuestionnaireComponent} from './evolution-questionnaire.component';

export default[
{
  path :':id',
  component: EvaluationQuestionnaireComponent,
}
] as Routes;