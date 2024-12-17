select d.spec_name, d.genus, d.is_local 
from Development.species as d
left join Test.species as t
on d.spec_name = t.spec_name
where t.spec_name is null;

insert into Test.species(
select Development.species.spec_name, Development.species.genus, Development.species.is_local 
from Development.species
left join Test.species
on Development.species.spec_name = Test.species.spec_name
where Test.species.spec_name is null);
rollback;

select * 
from Development.specimen as d
left join Test.specimen as t
on d.spec_acquis_date = t.spec_acquis_date and d.spec_name = t.spec_name
where t.spec_name is null;

select * from Development.model
left join Test.model
on Development.model.uid = Test.model.uid
where Test.model.uid is null and Development.model.annotated is true;

select * 
from Development.image_set as d
left join Test.image_set as t
on d.spec_name = t.spec_name and d.spec_acquis_date = t.spec_acquis_date and d.set_no = t.set_no
where t.spec_name is null and d.uid is not null and d.uid in (select uid from Test.model);

select * from Development.annotations
left join Test.annotations
on Development.annotations.annotation_id = Test.annotations.annotation_id
where Test.annotations.annotation_id is null and Development.annotations.uid in (select uid from Test.model);

select * from Development.photo_annotation
left join Test.photo_annotation
on Development.photo_annotation.annotation_id = Test.photo_annotation.annotation_id
where Test.photo_annotation.annotation_id is null and Development.photo_annotation.annotation_id in (select annotation_id from Test.annotations);

select * from Development.video_annotation
left join Test.video_annotation
on Development.video_annotation.annotation_id = Test.video_annotation.annotation_id
where Test.video_annotation.annotation_id is null and Development.video_annotation.annotation_id in (select annotation_id from Test.annotations);

select * from Development.model_annotation
left join Test.model_annotation
on Development.model_annotation.annotation_id = Test.model_annotation.annotation_id
where Test.model_annotation.annotation_id is null and Development.model_annotation.annotation_id in (select annotation_id from Test.annotations);