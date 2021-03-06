import * as React from "react";
import { Course } from "../../../domain/models";
import LevelIcon from "../../LevelIcon/LevelIcon";

import './BundleCourse.css';


export interface BundleCourseProps {
    course: Course;
}

const BundleCourse: React.StatelessComponent<BundleCourseProps> = (props: BundleCourseProps) => {
    const course = props.course;

    return (
        <div className="bundle-course">
            <div className="bundle-course-info">

                <span className="title">{course.title}</span>
            </div>
            <LevelIcon level={props.course.level} />
        </div>
    );
};

export default BundleCourse;
